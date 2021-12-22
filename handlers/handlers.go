package handlers

import "github.com/gofiber/fiber/v2"

func Pong(c *fiber.Ctx) error {
	return c.Status(200).SendString("ok")
}
