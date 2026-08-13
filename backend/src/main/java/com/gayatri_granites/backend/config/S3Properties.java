package com.gayatri_granites.backend.config;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "aws.s3")
@Getter
@Setter
public class S3Properties {
    private String bucket;
    private String region;
}