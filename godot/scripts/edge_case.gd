extends Node2D
## Edge Case's original broken-token silhouette. Character preview, not movement yet.

var elapsed: float = 0.0


func _process(delta: float) -> void:
	elapsed += delta
	queue_redraw()


func _draw() -> void:
	var cream := Color("ffe9c8")
	var ink := Color("29213e")
	var gold := Color("ffda61")
	draw_circle(Vector2(-25, 64), 14.0, ink)
	draw_circle(Vector2(27, 64), 14.0, ink)
	draw_line(Vector2(-37, 70), Vector2(-13, 70), gold, 8.0, true)
	draw_line(Vector2(15, 70), Vector2(39, 70), gold, 8.0, true)
	draw_line(Vector2(-49, 5), Vector2(-66, 25), ink, 13.0, true)
	draw_line(Vector2(49, 5), Vector2(67, -20), ink, 13.0, true)
	var shell := PackedVector2Array(
		[
			Vector2(-55, -25),
			Vector2(-17, -65),
			Vector2(25, -61),
			Vector2(25, -35),
			Vector2(54, -27),
			Vector2(63, 24),
			Vector2(14, 57),
			Vector2(-44, 42),
		]
	)
	draw_colored_polygon(shell, cream)
	var rim := PackedVector2Array(
		[
			Vector2(-38, -16),
			Vector2(-12, -44),
			Vector2(17, -37),
			Vector2(41, -17),
			Vector2(43, 20),
			Vector2(10, 39),
			Vector2(-30, 25),
		]
	)
	draw_colored_polygon(rim, ink)
	var face := PackedVector2Array(
		[
			Vector2(-29, -12),
			Vector2(-7, -33),
			Vector2(17, -27),
			Vector2(32, -10),
			Vector2(31, 17),
			Vector2(7, 29),
			Vector2(-25, 18),
		]
	)
	draw_colored_polygon(face, gold)
	draw_circle(Vector2(-10, -4), 6.0, ink)
	draw_circle(Vector2(19, -4), 6.0, ink)
	draw_arc(Vector2(4, 9), 10.0, 0.2, PI - 0.2, 16, ink, 4.0, true)
	var fragment := Vector2(72, -70 + sin(elapsed * 3.0) * 6.0)
	draw_rect(Rect2(fragment - Vector2(13, 13), Vector2(26, 26)), Color("79e8d2"))
	draw_circle(fragment + Vector2(-13, 27), 3.0, Color("79e8d2"))
	draw_circle(fragment + Vector2(-20, 40), 2.0, Color("79e8d2"))
