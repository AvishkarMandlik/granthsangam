package com.demo.controller;

import com.demo.model.Category;
import com.demo.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepo;

    @GetMapping
    public List<Category> getAll() {
        return categoryRepo.findAll();
    }

    @PostMapping
    public Category add(@RequestBody Category category) {
        return categoryRepo.findByName(category.getName())
                .orElseGet(() -> categoryRepo.save(category));
    }

}
