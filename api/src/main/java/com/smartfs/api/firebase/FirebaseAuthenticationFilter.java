package com.smartfs.api.firebase;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class FirebaseAuthenticationFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
         String authHeader = request.getHeader("Authorization");

         if(authHeader != null && authHeader.startsWith("Bearer ")){
             String idToken = authHeader.substring(7);
             try{
                 FirebaseToken token = FirebaseAuth.getInstance().verifyIdToken(idToken);
                 FirebaseAuthenticationToken authenticationToken = new FirebaseAuthenticationToken(token);

                 SecurityContextHolder.getContext().setAuthentication(authenticationToken);
             }
             catch (Exception e){
                 logger.error("Incorrect/expired token: ", e);
             }
         }

         filterChain.doFilter(request, response);
    }
}
