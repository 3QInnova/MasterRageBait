extends SceneTree
## Checks that the actual startup scene loads and its scripts run in the engine.


func _init() -> void:
	call_deferred("run_smoke")


func run_smoke() -> void:
	var scene := load("res://scenes/main.tscn") as PackedScene
	if scene == null:
		push_error("Main scene did not load")
		quit(1)
		return
	var instance := scene.instantiate()
	root.add_child(instance)
	await process_frame
	await process_frame
	if not instance.has_node("EdgeCase") or instance.get_child_count() < 7:
		push_error("Startup scene failed to construct its character or UI")
		quit(1)
		return
	print("PASS: startup scene, Edge Case character, and UI initialized in Godot.")
	quit(0)
