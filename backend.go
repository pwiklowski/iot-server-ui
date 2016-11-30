package main

import "github.com/kataras/iris"
import "github.com/kataras/iris/config"
import "gopkg.in/mgo.v2"
import "gopkg.in/mgo.v2/bson"
import "github.com/satori/go.uuid"
import "fmt"
import "strconv"

type Log struct {
	Timestamp  int64
	Content    string
	ScriptUuid string
}

type ScriptVersion struct {
	Version int `bson:"version"`
	Content string
}
type Aliases struct {
	Alias map[string]string
}

type Alias struct {
	ID   string
	Name string
}

type Value struct {
	DeviceUuid string
	Variable   string
	Value      string
}

type Action struct {
	Name   string
	Values []Value
}

type Widget struct {
	WidgetUuid string
	Name       string
	Actions    []Action
}

type Script struct {
	Id         bson.ObjectId `_id`
	Name       string
	ScriptUuid string `bson:"scriptuuid"`
	DeviceUuid []string
	Scripts    []ScriptVersion
}

func main() {
	session, err := mgo.Dial("mongo:27017")
	if err != nil {
		panic(err)
	}
	defer session.Close()

	db := session.DB("iot-webui")
	scriptsDb := db.C("scripts")
	widgetsDb := db.C("widgets")
	aliasDb := db.C("alias")

	api := iris.New(config.Iris{MaxRequestBodySize: 32 << 20})

	api.Get("/aliases", func(c *iris.Context) {
		aliases := Aliases{}
		aliasDb.Find(nil).One(&aliases)
		c.JSON(iris.StatusOK, aliases)
	})
	api.Post("/aliases", func(c *iris.Context) {
		aliases := Aliases{}

		newAlias := Alias{}
		c.ReadJSON(&newAlias)

		err := aliasDb.Find(nil).One(&aliases)

		if err != nil {
			println("error: " + err.Error())
			aliases.Alias = make(map[string]string)
			aliases.Alias[newAlias.ID] = newAlias.Name
			aliasDb.Insert(aliases)
		} else {
			aliases.Alias[newAlias.ID] = newAlias.Name
			aliasDb.Update(bson.M{}, aliases)
		}
		c.JSON(iris.StatusOK, aliases)
	})

	api.Get("/widgets", func(c *iris.Context) {
		widgets := []Widget{}
		widgetsDb.Find(nil).All(&widgets)
		c.JSON(iris.StatusOK, widgets)
	})
	api.Get("/widget/:widgetUuid", func(c *iris.Context) {
		widget := Widget{}
		widgetsUuid := c.Param("widgetUuid")
		widgetsDb.Find(bson.M{"widgetuuid": widgetsUuid}).One(&widget)
		c.JSON(iris.StatusOK, widget)
	})
	api.Post("/widget", func(c *iris.Context) {
		widget := Widget{}
		c.ReadJSON(&widget)

		widget.WidgetUuid = uuid.NewV4().String()

		err := widgetsDb.Insert(widget)
		if err != nil {
			panic(err)
		}
		c.JSON(iris.StatusOK, widget)
	})

	api.Delete("/widget/:widgetUuid", func(c *iris.Context) {
		widgetUuid := c.Param("widgetUuid")

		err := widgetsDb.Remove(bson.M{"widgetuuid": widgetUuid})
		if err != nil {
			println("error: " + err.Error())
		}
		c.JSON(iris.StatusOK, nil)
	})

	api.Post("/widget/:widgetUuid", func(c *iris.Context) {
		widget := Widget{}
		sentWidget := Widget{}
		c.ReadJSON(&sentWidget)
		widgetUuid := c.Param("widgetUuid")

		err := widgetsDb.Find(bson.M{"widgetuuid": widgetUuid}).One(&widget)
		if err != nil {
			println("error: " + err.Error())
		}

		widget.Actions = sentWidget.Actions
		widget.Name = sentWidget.Name

		err = widgetsDb.Update(bson.M{"widgetuuid": widgetUuid}, widget)
		if err != nil {
			panic(err)
		}
		c.JSON(iris.StatusOK, widget)
	})
	api.Get("/scripts", func(c *iris.Context) {
		scripts := []Script{}
		scriptsDb.Find(nil).Select(bson.M{"scripts": bson.M{"$slice": -1}}).All(&scripts)
		c.JSON(iris.StatusOK, scripts)
	})
	api.Get("/scripts/device/:deviceUuid", func(c *iris.Context) {
		scripts := []Script{}
		deviceUuid := c.Param("deviceUuid")
		scriptsDb.Find(bson.M{"deviceuuid": deviceUuid}).Select(bson.M{"scripts": bson.M{"$slice": -1}}).All(&scripts)
		c.JSON(iris.StatusOK, scripts)
	})
	api.Post("/scripts", func(c *iris.Context) {
		script := Script{}
		c.ReadJSON(&script)

		i := bson.NewObjectId()
		script.Id = i
		script.ScriptUuid = uuid.NewV4().String()
		script.Scripts = []ScriptVersion{}

		scriptVersion := ScriptVersion{}
		scriptVersion.Version = 1
		scriptVersion.Content = "Ly9GaWxsIG1l"

		script.Scripts = append(script.Scripts, scriptVersion)

		err := scriptsDb.Insert(script)
		if err != nil {
			panic(err)
		}
		c.JSON(iris.StatusOK, script)
	})

	api.Delete("/script/:scriptUuid", func(c *iris.Context) {
		scriptUuid := c.Param("scriptUuid")

		err := scriptsDb.Remove(bson.M{"scriptuuid": scriptUuid})
		if err != nil {
			println("error: " + err.Error())
		}
		c.JSON(iris.StatusOK, nil)
	})

	api.Post("/script/:scriptUuid", func(c *iris.Context) {
		script := Script{}
		sentScript := Script{}
		sentScript.DeviceUuid = nil
		c.ReadJSON(&sentScript)
		scriptUuid := c.Param("scriptUuid")

		err := scriptsDb.Find(bson.M{"scriptuuid": scriptUuid}).One(&script)
		if err != nil {
			println("error: " + err.Error())
		}

		script.ScriptUuid = scriptUuid

		fmt.Println(sentScript.DeviceUuid)
		if sentScript.Name != "" {
			script.Name = sentScript.Name
		}

		if sentScript.DeviceUuid != nil {
			script.DeviceUuid = sentScript.DeviceUuid
		}

		err = scriptsDb.Update(bson.M{"scriptuuid": scriptUuid}, script)
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

		err := scriptsDb.Find(bson.M{"scriptuuid": scriptUuid}).Select(bson.M{"scripts": bson.M{"$slice": -1}}).One(&script)
		if err != nil {
			println("error: " + err.Error())
		}
		c.JSON(iris.StatusOK, script)
	})

	api.Get("/scriptVersions/:scriptUuid", func(c *iris.Context) {
		script := Script{}
		scriptUuid := c.Param("scriptUuid")

		err := scriptsDb.Find(bson.M{"scriptuuid": scriptUuid}).One(&script)
		if err != nil {
			println("error: " + err.Error())
		}

		var versions []int

		for _, version := range script.Scripts {
			versions = append(versions, version.Version)
		}

		c.JSON(iris.StatusOK, versions)

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

	api.Listen("0.0.0.0:7001")
}
