package com.Cartlyst.CartlystAPI.controller;

import com.Cartlyst.CartlystAPI.model.*;
import com.Cartlyst.CartlystAPI.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/views")
public class ViewController {

    @Autowired
    private ViewRepository viewRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/add")
    public String addView(@RequestBody View view) {
        return "View added successfully";
    }
     
    @PutMapping("/update")
    public String updateView(@RequestBody View view) {
        return "View updated successfully";
    }

     @GetMapping("/{userId}")
    public List<View> getUserCart(@PathVariable String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return viewRepository.findByUser(user);
    }
}