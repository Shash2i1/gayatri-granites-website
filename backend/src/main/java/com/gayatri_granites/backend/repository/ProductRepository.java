package com.gayatri_granites.backend.repository;


import com.gayatri_granites.backend.entity.Product;
import com.gayatri_granites.backend.enums.StockStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByStockStatus(StockStatus stockStatus);
    List<Product> findByActiveTrue();
}