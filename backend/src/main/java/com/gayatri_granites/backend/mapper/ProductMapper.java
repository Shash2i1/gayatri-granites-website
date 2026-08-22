package com.gayatri_granites.backend.mapper;

import com.gayatri_granites.backend.dto.response.*;
import com.gayatri_granites.backend.entity.Product;
import com.gayatri_granites.backend.entity.ProductImage;
import com.gayatri_granites.backend.entity.ProductVariant;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

	public ProductResponse toResponse(Product product) {
		return ProductResponse.builder().id(product.getId()).name(product.getName())
				.description(product.getDescription())
				.category(CategorySummaryResponse.builder().id(product.getCategory().getId())
						.name(product.getCategory().getName()).build())
				.materialType(product.getMaterialType()).origin(product.getOrigin())
				.pricingUnit(product.getPricingUnit()).basePrice(product.getBasePrice())
				.discountPrice(product.getDiscountPrice()).stockStatus(product.getStockStatus())
				.totalStockQuantity(product.getTotalStockQuantity()).active(product.getActive())
				.variants(toVariantResponses(product.getVariants())).images(toImageResponses(product.getImages()))
				.createdAt(product.getCreatedAt()).updatedAt(product.getUpdatedAt()).build();
	}

	public List<ProductResponse> toResponseList(List<Product> products) {
		return products.stream().map(this::toResponse).collect(Collectors.toList());
	}

	public VariantResponse toVariantResponse(ProductVariant variant) {
		return VariantResponse.builder().id(variant.getId()).size(variant.getSize()).finish(variant.getFinish())
				.thicknessMm(variant.getThicknessMm()).priceAdjustment(variant.getPriceAdjustment())
				.stockQuantity(variant.getStockQuantity()).sku(variant.getSku()).build();
	}

	public ImageResponse toImageResponse(ProductImage image) {
		return ImageResponse.builder().id(image.getId()).imageUrl(image.getImageUrl()).isPrimary(image.getIsPrimary())
				.displayOrder(image.getDisplayOrder()).build();
	}

	private List<VariantResponse> toVariantResponses(List<ProductVariant> variants) {
		return variants.stream().map(this::toVariantResponse).collect(Collectors.toList());
	}

	private List<ImageResponse> toImageResponses(List<ProductImage> images) {
		return images.stream().map(this::toImageResponse).collect(Collectors.toList());
	}

	public ProductSummaryResponse toSummaryResponse(Product product) {
		String primaryImage = product.getImages().stream().filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
				.map(ProductImage::getImageUrl).findFirst()
				.orElse(product.getImages().isEmpty() ? null : product.getImages().get(0).getImageUrl());

		return ProductSummaryResponse.builder().id(product.getId()).name(product.getName())
				.categoryName(product.getCategory().getName()).materialType(product.getMaterialType())
				.pricingUnit(product.getPricingUnit()).basePrice(product.getBasePrice())
				.discountPrice(product.getDiscountPrice()).stockStatus(product.getStockStatus())
				.primaryImageUrl(primaryImage).build();
	}

	public List<ProductSummaryResponse> toSummaryResponseList(List<Product> products) {
		return products.stream().map(this::toSummaryResponse).collect(Collectors.toList());
	}
}