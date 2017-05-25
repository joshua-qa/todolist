package kr.or.connect.todo.service;

import java.util.Collection;
import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.stereotype.Service;

import kr.or.connect.todo.domain.Todo;
import kr.or.connect.todo.persistence.TodoDao;

@Service
public class TodoService {
	private TodoDao dao;
	private ConcurrentMap<Integer, Todo> repo = new ConcurrentHashMap<>();
	private AtomicInteger maxId = new AtomicInteger(0);
	private Date d = new Date();
	
	public TodoService(TodoDao dao) {
		this.dao = dao;
	}
	
	public Collection<Todo> findAll() {
		return repo.values();
	}
	
	public Todo create(Todo todo) {
		Integer id = maxId.addAndGet(1);
		todo.setId(id);
		repo.put(id, todo);
		return todo;
	}
	
	public boolean update(Todo todo) {
		Todo old = repo.put(todo.getId(), todo);
		return old != null;
	}
	
	public boolean delete(Integer id) {
		Todo old = repo.remove(id);
		return old != null;
	}
}
