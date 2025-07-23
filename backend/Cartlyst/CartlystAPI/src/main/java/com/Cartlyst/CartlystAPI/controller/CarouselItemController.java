package com.Cartlyst.CartlystAPI.controller;

import com.Cartlyst.CartlystAPI.model.CarouselItem;
import com.Cartlyst.CartlystAPI.repository.CarouselItemRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/carousel")
@CrossOrigin(origins = "*")
public class CarouselItemController {

    private final CarouselItemRepository carouselRepo;

    public CarouselItemController(CarouselItemRepository carouselRepo) {
        this.carouselRepo = carouselRepo;
    }

    @GetMapping
    public List<CarouselItem> getAllCarouselItems() {
        return carouselRepo.findAll();
    }

    @PostMapping
    public CarouselItem createCarouselItem(@RequestBody CarouselItem item) {
        return carouselRepo.save(item);
    }
}
