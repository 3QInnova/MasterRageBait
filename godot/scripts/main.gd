extends Control
## Toolchain landing scene. The browser game is still the playable reference.

const INK := Color("17142e")
const MINT := Color("79e8d2")


func _ready() -> void:
	add_text("EDGE CASE", 42, 42, 336, 40, 30)
	add_text("GODOT WORKSPACE READY", 42, 96, 336, 30, 14)
	add_text("PATCH: I migrated the confidence.\nThe gameplay is next.", 42, 156, 336, 66, 19)
	add_text("Unexpected input.\nUnreasonable confidence.", 42, 460, 336, 70, 23)
	add_text(
		"Character preview + verified CLI tools.\nThe native gameplay port has not started.",
		42,
		560,
		336,
		62,
		15
	)
	var button := Button.new()
	button.text = "Play the browser prototype"
	button.position = Vector2(42, 650)
	button.size = Vector2(336, 54)
	button.add_theme_color_override("font_color", INK)
	var style := StyleBoxFlat.new()
	style.bg_color = MINT
	style.set_corner_radius_all(12)
	button.add_theme_stylebox_override("normal", style)
	button.pressed.connect(func() -> void: OS.shell_open("http://localhost:8000"))
	add_child(button)
	add_text("VS Code: F5 to debug · Ctrl/Cmd+Shift+B to check", 30, 750, 360, 38, 12)


func add_text(
	value: String, x: float, y: float, width: float, height: float, font_size: int
) -> void:
	var label := Label.new()
	label.text = value
	label.position = Vector2(x, y)
	label.size = Vector2(width, height)
	label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	label.add_theme_font_size_override("font_size", font_size)
	label.add_theme_color_override("font_color", Color("fff0d4"))
	add_child(label)
