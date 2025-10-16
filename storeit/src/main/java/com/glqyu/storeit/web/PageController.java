package com.glqyu.storeit.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {
    @GetMapping("/")
    public String index() { return "forward:/static/index.html"; }

    @GetMapping("/login")
    public String login() { return "forward:/static/login.html"; }

    @GetMapping("/list")
    public String list() { return "forward:/static/list.html"; }
}
