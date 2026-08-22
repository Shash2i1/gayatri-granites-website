package com.gayatri_granites.backend.controller;

import com.gayatri_granites.backend.dto.response.ProductResponse;
import com.gayatri_granites.backend.dto.response.ProductSummaryResponse;
import com.gayatri_granites.backend.service.PublicProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class PublicProductController {

    private final PublicProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductSummaryResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductSummaryResponse>> getByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductSummaryResponse>> search(@RequestParam String q) {
        return ResponseEntity.ok(productService.searchProducts(q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductDetail(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductDetail(id));
    }
}