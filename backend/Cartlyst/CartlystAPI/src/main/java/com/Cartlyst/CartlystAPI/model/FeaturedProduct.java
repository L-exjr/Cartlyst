package com.Cartlyst.CartlystAPI.model;

import jakarta.persistence.*;

@Entity
public class FeaturedProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Product product;

    public FeaturedProduct() {}

    public FeaturedProduct(Product product) {
        this.product = product;
    }

    public Long getId() {
        return id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}
