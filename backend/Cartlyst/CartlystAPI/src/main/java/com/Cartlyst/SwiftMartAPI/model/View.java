package com.Cartlyst.CartlystAPI.model;

import jakarta.persistence.*;

@Entity
public class View {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Product product;

    private int numberOfViews;

    // Constructors
    public View() {}

    public View(User user, Product product, int numberOfViews) {
        this.user = user;
        this.product = product;
        this.numberOfViews = numberOfViews;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public int getQuantity() { return numberOfViews; }
    public void setQuantity(int quantity) { this.numberOfViews = numberOfViews; }
}
