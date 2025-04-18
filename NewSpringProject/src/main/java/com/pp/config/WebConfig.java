package com.pp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**")
                //.addResourceLocations("file:///C:/SpringUpload/ocr_img/");
        		.addResourceLocations("file:///C://Users//smhrd//Desktop//중요한거//NewSpringProject//src//main//webapp//upload/");

    }
}
	

