package com.smartfs.api.controllers;

import com.google.firebase.auth.FirebaseToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/byToken")
    public String getUser(@AuthenticationPrincipal FirebaseToken token){
        if(token == null) return "No user authenticated";

        return "Authenticated user" + token.getEmail() + " uuid: " + token.getUid();
    }

    @GetMapping("/ping-db")
    public String pingDb(){
        return jdbcTemplate.queryForObject("SELECT NOW()", String.class);
    }

}
