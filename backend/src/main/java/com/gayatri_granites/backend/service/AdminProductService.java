package com.gayatri_granites.backend.service;

import com.gayatri_granites.backend.dto.*;
import com.gayatri_granites.backend.dto.response.ImageResponse;
import com.gayatri_granites.backend.dto.response.ProductResponse;
import com.gayatri_granites.backend.dto.response.VariantResponse;
import com.gayatri_granites.backend.entity.*;
import com.gayatri_granites.backend.enums.StockStatus;
import com.gayatri_granites.backend.mapper.ProductMapper;
import com.gayatri_granites.backend.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final ProductImageRepository imageRepository;
    private final CategoryRepository categoryRepository;
    private final S3StorageService s3Service;
    private final ProductMapper productMapper;

    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        return productMapper.toResponseList(productRepository.findAll());
    }

    @Transactional(readOnly = true)
    public ProductResponse getProduct(Long id) {
        Product product = findProductEntity(id);
        return productMapper.toResponse(product);
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found: " + request.getCategoryId()));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(category)
                .materialType(request.getMaterialType())
                .origin(request.getOrigin())
                .pricingUnit(request.getPricingUnit())
                .basePrice(request.getBasePrice())
                .totalStockQuantity(request.getTotalStockQuantity())
                .stockStatus(deriveStockStatus(request.getTotalStockQuantity()))
                .active(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Product saved = productRepository.save(product);
        log.info("Product created: [{}]", saved.getName());
        return productMapper.toResponse(saved);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = findProductEntity(id);

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found: " + request.getCategoryId()));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(category);
        product.setMaterialType(request.getMaterialType());
        product.setOrigin(request.getOrigin());
        product.setPricingUnit(request.getPricingUnit());
        product.setBasePrice(request.getBasePrice());
        product.setTotalStockQuantity(request.getTotalStockQuantity());
        product.setStockStatus(deriveStockStatus(request.getTotalStockQuantity()));
        product.setUpdatedAt(LocalDateTime.now());

        Product saved = productRepository.save(product);
        log.info("Product updated: [{}]", saved.getName());
        return productMapper.toResponse(saved);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = findProductEntity(id);
        product.setActive(false);
        product.setUpdatedAt(LocalDateTime.now());
        productRepository.save(product);
        log.info("Product deactivated (soft-deleted): [{}]", id);
    }

    @Transactional
    public ImageResponse addImage(Long productId, MultipartFile file, boolean isPrimary, Integer displayOrder) {
        Product product = findProductEntity(productId);

        S3StorageService.UploadResult result = s3Service.upload(file, "products");

        ProductImage image = ProductImage.builder()
                .product(product)
                .imageUrl(result.url())
                .s3Key(result.key())
                .isPrimary(isPrimary)
                .displayOrder(displayOrder)
                .build();

        ProductImage saved = imageRepository.save(image);
        log.info("Image uploaded and linked to product [{}]", productId);
        return productMapper.toImageResponse(saved);
    }

    @Transactional
    public void deleteImage(Long imageId) {
        ProductImage image = imageRepository.findById(imageId)
                .orElseThrow(() -> new EntityNotFoundException("Image not found: " + imageId));

        s3Service.delete(image.getS3Key());
        imageRepository.delete(image);
        log.info("Image [{}] deleted", imageId);
    }

    @Transactional
    public ProductResponse updateStock(Long productId, StockUpdateRequest request) {
        Product product = findProductEntity(productId);
        product.setTotalStockQuantity(request.getTotalStockQuantity());
        product.setStockStatus(deriveStockStatus(request.getTotalStockQuantity()));
        product.setUpdatedAt(LocalDateTime.now());

        Product saved = productRepository.save(product);
        log.info("Stock updated for product [{}] -> {}", productId, request.getTotalStockQuantity());
        return productMapper.toResponse(saved);
    }

    @Transactional
    public ProductResponse updatePrice(Long productId, PriceUpdateRequest request) {
        Product product = findProductEntity(productId);
        product.setBasePrice(request.getBasePrice());
        product.setUpdatedAt(LocalDateTime.now());

        Product saved = productRepository.save(product);
        log.info("Price updated for product [{}] -> {}", productId, request.getBasePrice());
        return productMapper.toResponse(saved);
    }

    @Transactional
    public ProductResponse updateDiscount(Long productId, DiscountRequest request) {
        Product product = findProductEntity(productId);
        product.setDiscountPrice(request.getDiscountPrice());
        product.setUpdatedAt(LocalDateTime.now());

        Product saved = productRepository.save(product);
        log.info("Discount updated for product [{}] -> {}", productId, request.getDiscountPrice());
        return productMapper.toResponse(saved);
    }

    @Transactional
    public VariantResponse addVariant(Long productId, VariantRequest request) {
        Product product = findProductEntity(productId);

        ProductVariant variant = ProductVariant.builder()
                .product(product)
                .size(request.getSize())
                .finish(request.getFinish())
                .thicknessMm(request.getThicknessMm())
                .priceAdjustment(request.getPriceAdjustment())
                .stockQuantity(request.getStockQuantity())
                .sku(request.getSku())
                .build();

        ProductVariant saved = variantRepository.save(variant);
        log.info("Variant added to product [{}]: sku=[{}]", productId, saved.getSku());
        return productMapper.toVariantResponse(saved);
    }

    private Product findProductEntity(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found: " + id));
    }

    private StockStatus deriveStockStatus(Integer quantity) {
        if (quantity == null || quantity <= 0) return StockStatus.OUT_OF_STOCK;
        if (quantity < 10) return StockStatus.LOW_STOCK;
        return StockStatus.IN_STOCK;
    }
}