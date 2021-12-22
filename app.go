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
	v1 := app.Group("/api")
	v1.Get("/ping", handlers.Pong)
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
