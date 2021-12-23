package main

import (
	"flag"
	"server/handlers"

	"github.com/gofiber/fiber/v2"
)

var (
	port = flag.String("port", ":3000", "Port to listen on")
	prod = flag.Bool("prod", false, "Enable prefork in Production")
)

func setupRoutes(app *fiber.App) {
	apiGroup := app.Group("/api")
	apiGroup.Get("/ping", handlers.Pong)
	fileGroup := app.Group("/file")
	fileGroup.Static("/csv", "./file/csv/")
}

func NewServer() *fiber.App {
	app := fiber.New()

	setupRoutes(app)

	app.Static("/", "./static/build/")

	return app
}

func main() {
	app := NewServer()
	app.Listen(*port)
}
