package com.Cartlyst.CartlystAPI.model;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String icon; // e.g. "shopping-cart"
    private String iconFamily; // e.g. "MaterialIcons"

    private String image; // image URL for frontend

    public Category() {}

    public Category(String name, String icon, String iconFamily, String image) {
        this.name = name;
        this.icon = icon;
        this.iconFamily = iconFamily;
        this.image = image;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getIcon() {
        return icon;
    }

    public String getIconFamily() {
        return iconFamily;
    }

    public String getImage() {
        return image;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public void setIconFamily(String iconFamily) {
        this.iconFamily = iconFamily;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
