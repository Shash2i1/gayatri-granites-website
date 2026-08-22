package com.gayatri_granites.backend.service;

import com.gayatri_granites.backend.dto.response.ProductResponse;
import com.gayatri_granites.backend.dto.response.ProductSummaryResponse;
import com.gayatri_granites.backend.entity.Product;
import com.gayatri_granites.backend.mapper.ProductMapper;
import com.gayatri_granites.backend.repository.CategoryRepository;
import com.gayatri_granites.backend.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PublicProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    @Transactional(readOnly = true)
    public List<ProductSummaryResponse> getAllProducts() {
        return productMapper.toSummaryResponseList(productRepository.findByActiveTrue());
    }

    @Transactional(readOnly = true)
    public List<ProductSummaryResponse> getProductsByCategory(Long categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new EntityNotFoundException("Category not found: " + categoryId);
        }
        return productMapper.toSummaryResponseList(
                productRepository.findByActiveTrueAndCategoryId(categoryId));
    }

    @Transactional(readOnly = true)
    public List<ProductSummaryResponse> searchProducts(String keyword) {
        return productMapper.toSummaryResponseList(
                productRepository.findByActiveTrueAndNameContainingIgnoreCase(keyword));
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductDetail(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found: " + id));

        if (!Boolean.TRUE.equals(product.getActive())) {
            throw new EntityNotFoundException("Product not found: " + id);
            // deliberately same message as a truly-missing product - don't leak
            // that a product exists but was deactivated
        }

        return productMapper.toResponse(product);
    }
}