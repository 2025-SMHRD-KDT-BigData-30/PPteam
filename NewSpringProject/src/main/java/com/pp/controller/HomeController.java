package com.pp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@Controller
public class HomeController {
	
	@GetMapping("/ping")
    public String home() {
        return "index";
    }
	
//	@RequestMapping({"/", "/study/**", "/quiz/**"})
//    public String forward() {
//        return "/react/index.html";  // 위치: webapp/react/index.html
//    }
}
