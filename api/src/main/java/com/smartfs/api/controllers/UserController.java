package com.smartfs.api.controllers;

import com.google.firebase.auth.FirebaseToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("/user")
public class UserController {

    @GetMapping("/byToken")
    public String getUser(@AuthenticationPrincipal FirebaseToken token){
        if(token == null) return "No user authenticated";

        return "Authenticated user" + token.getEmail() + " uuid: " + token.getUid();
    }

}
