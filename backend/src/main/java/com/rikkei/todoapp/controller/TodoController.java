package com.rikkei.todoapp.controller;

import com.rikkei.todoapp.model.Todo;
import com.rikkei.todoapp.repository.TodoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "*")
public class TodoController {

    private final TodoRepository todoRepository;

    public TodoController(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    // GET - Lấy tất cả todos
    @GetMapping
    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    // POST - Tạo todo mới
    @PostMapping
    public Todo createTodo(@RequestBody Todo todo) {
        return todoRepository.save(todo);
    }

    // PUT - Cập nhật todo
    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo todoDetails) {
        return todoRepository.findById(id)
                .map(todo -> {
                    todo.setTitle(todoDetails.getTitle());
                    todo.setCompleted(todoDetails.isCompleted());
                    return ResponseEntity.ok(todoRepository.save(todo));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE - Xóa todo
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        return todoRepository.findById(id)
                .map(todo -> {
                    todoRepository.delete(todo);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
