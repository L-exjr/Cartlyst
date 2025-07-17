// CarouselItem.java
package com.Cartlyst.CartlystAPI.model;

import jakarta.persistence.*;

@Entity
@Table(name = "carousel_items")
public class CarouselItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // usually "image"
    private String source; // image URL
    private String title;

    // Constructors
    public CarouselItem() {}

    public CarouselItem(String type, String source, String title) {
        this.type = type;
        this.source = source;
        this.title = title;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
}
