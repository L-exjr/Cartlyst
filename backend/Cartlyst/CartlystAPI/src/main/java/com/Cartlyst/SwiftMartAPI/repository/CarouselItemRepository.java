// CarouselItemRepository.java
package com.Cartlyst.CartlystAPI.repository;

import com.Cartlyst.CartlystAPI.model.CarouselItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarouselItemRepository extends JpaRepository<CarouselItem, Long> {
}
