package main

import "github.com/kataras/iris"
import "github.com/kataras/iris/config"
import "gopkg.in/mgo.v2"
import "gopkg.in/mgo.v2/bson"
import "github.com/satori/go.uuid"
import "fmt"

type Script struct {
	Id         bson.ObjectId `_id`
	ScriptUuid string
	DeviceUuid string
	Version    int
	Content    string
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

		err := scriptsDb.Find(bson.M{"scriptuuid": scriptUuid}).Sort("-version").One(&script)
		if err != nil {
			println("error: " + err.Error())
		}

		i := bson.NewObjectId()
		script.Id = i
		script.ScriptUuid = scriptUuid
		script.Version = script.Version + 1
		script.Content = sentScript.Content

		err = scriptsDb.Insert(script)
		if err != nil {
			panic(err)
		}
		c.JSON(iris.StatusOK, script)
	})

	api.Get("/script/:scriptUuid", func(c *iris.Context) {
		script := Script{}
		scriptUuid := c.Param("scriptUuid")
		fmt.Println(scriptUuid)

		err := scriptsDb.Find(bson.M{"scriptuuid": scriptUuid}).Sort("-version").One(&script)
		if err != nil {
			println("error: " + err.Error())
		}
		c.JSON(iris.StatusOK, script)
	})

	api.Listen(":8001")
}
