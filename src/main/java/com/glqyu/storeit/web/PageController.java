package com.glqyu.storeit.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {
    @GetMapping("/")
    public String index() { return "forward:/static/list.html"; }

    @GetMapping("/about")
    public String about() { return "forward:/static/index.html"; }

    @GetMapping("/login")
    public String login() { return "forward:/static/login.html"; }

    @GetMapping("/change-password")
    public String changePassword() { return "forward:/static/change-password.html"; }

    @GetMapping("/admin")
    public String admin() { return "forward:/static/admin.html"; }

    @GetMapping("/list")
    public String list() { return "redirect:/"; }

    @GetMapping("/404")
    public String notFound() { return "forward:/static/404.html"; }

    @GetMapping("/403")
    public String forbidden() { return "forward:/static/403.html"; }
}
