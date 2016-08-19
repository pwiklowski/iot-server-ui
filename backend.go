package main

import "github.com/kataras/iris"
import "github.com/kataras/iris/config"
import "gopkg.in/mgo.v2"
import "gopkg.in/mgo.v2/bson"
import "github.com/satori/go.uuid"
import "fmt"
import "strconv"

type ScriptVersion struct {
	Version int `bson:"version"`
	Content string
}

type Script struct {
	Id         bson.ObjectId `_id`
	Name       string
	ScriptUuid string `bson:"scriptuuid"`
	DeviceUuid string
	Scripts    []ScriptVersion
}

func main() {
	session, err := mgo.Dial("172.17.0.2:27017")
	if err != nil {
		panic(err)
	}
	defer session.Close()

	db := session.DB("iot-webui")
	scriptsDb := db.C("scripts")

	api := iris.New(config.Iris{MaxRequestBodySize: 32 << 20})

	api.Get("/scripts", func(c *iris.Context) {
		scripts := []Script{}
		scriptsDb.Find(nil).All(&scripts)
		c.JSON(iris.StatusOK, scripts)
	})

	api.Post("/scripts", func(c *iris.Context) {
		script := Script{}
		c.ReadJSON(&script)

		i := bson.NewObjectId()
		script.Id = i
		script.ScriptUuid = uuid.NewV4().String()
		script.Scripts = []ScriptVersion{}

		err := scriptsDb.Insert(script)
		if err != nil {
			panic(err)
		}
		c.JSON(iris.StatusOK, script)
	})
	api.Post("/script/:scriptUuid", func(c *iris.Context) {
		script := Script{}
		sentScript := Script{}
		c.ReadJSON(&sentScript)
		scriptUuid := c.Param("scriptUuid")

		err := scriptsDb.Find(bson.M{"scriptuuid": scriptUuid}).One(&script)
		if err != nil {
			println("error: " + err.Error())
		}

		i := bson.NewObjectId()
		script.Id = i
		script.ScriptUuid = scriptUuid
		script.Name = sentScript.Name
		script.DeviceUuid = sentScript.DeviceUuid

		err = scriptsDb.Insert(script)
		if err != nil {
			panic(err)
		}
		c.JSON(iris.StatusOK, script)
	})
	api.Post("/script/:scriptUuid/version", func(c *iris.Context) {
		script := Script{}
		sentScript := ScriptVersion{}
		c.ReadJSON(&sentScript)
		scriptUuid := c.Param("scriptUuid")

		err := scriptsDb.Find(bson.M{"scriptuuid": scriptUuid}).One(&script)
		if err != nil {
			panic(err.Error())
		}

		scriptVersion := ScriptVersion{}
		if len(script.Scripts) == 0 {
			scriptVersion.Version = 1
		} else {
			scriptVersion.Version = script.Scripts[len(script.Scripts)-1].Version + 1
		}
		scriptVersion.Content = sentScript.Content

		script.Scripts = append(script.Scripts, scriptVersion)

		err = scriptsDb.Update(bson.M{"scriptuuid": scriptUuid}, script)
		if err != nil {
			panic(err)
		}
		c.JSON(iris.StatusOK, scriptVersion)
	})

	api.Get("/script/:scriptUuid", func(c *iris.Context) {
		script := Script{}
		scriptUuid := c.Param("scriptUuid")
		fmt.Println(scriptUuid)

		err := scriptsDb.Find(bson.M{"scriptuuid": scriptUuid}).Select(bson.M{"scripts": 0}).One(&script)
		if err != nil {
			println("error: " + err.Error())
		}
		c.JSON(iris.StatusOK, script)
	})

	api.Get("/script/:scriptUuid/:version", func(c *iris.Context) {
		script := Script{}
		scriptUuid := c.Param("scriptUuid")

		err := scriptsDb.Find(bson.M{"scriptuuid": scriptUuid}).One(&script)
		if err != nil {
			println("error: " + err.Error())
		}

		versionString := c.Param("version")
		if versionString == "latest" {
			c.JSON(iris.StatusOK, script.Scripts[len(script.Scripts)-1])
		} else {
			version, _ := strconv.Atoi(versionString)
			c.JSON(iris.StatusOK, script.Scripts[version-1])
		}

	})

	api.Listen(":8001")
}
