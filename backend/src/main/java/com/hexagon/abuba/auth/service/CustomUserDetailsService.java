package com.hexagon.abuba.auth.service;


import com.hexagon.abuba.auth.dto.CustomerUserDetails;
import com.hexagon.abuba.user.Parent;
import com.hexagon.abuba.user.repository.ParentRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final ParentRepository userRepository;

    public CustomUserDetailsService(ParentRepository userRepository) {

        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Parent userData = userRepository.findByUsername(username);

        if (userData != null) {

            return new CustomerUserDetails(userData);
        }


        return null;
    }
}
