package cit.edu.studyspace.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "User_Entity")
public class UserEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Unique identifier for the user", example = "1")
    private int id;
    
    @Column(nullable = false)
    @Schema(description = "User's first name", example = "John")
    private String firstName;
    
    @Column(nullable = true)
    @Schema(description = "User's last name", example = "Doe")
    private String lastName;
    
    @Column(nullable = false, unique = true)
    @Schema(description = "User's email address, used for login", example = "john.doe@example.com")
    private String email;
    
    @Column(nullable = true)
    @Schema(description = "User's encrypted password", example = "[encrypted password]")
    private String password;
    
    @Column(nullable = true)
    @Schema(description = "User's phone number", example = "09123456789")
    private String phoneNumber;
    
    @Column(nullable = true)
    @Schema(description = "Flag indicating if the user's email has been verified", example = "true")
    private boolean emailVerified;
    
    @Column(nullable = true)
    @Schema(description = "Creation timestamp of the user account")
    private LocalDateTime createdAt;
    
    @Column
    @Schema(description = "Last update timestamp of the user account")
    private LocalDateTime updatedAt;
    
    @Column
    @Schema(description = "Last login timestamp")
    private LocalDateTime lastLogin;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<BookingEntity> booking = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Schema(description = "User role in the system", example = "USER")
    private UserRole role;
    
    // Constructors
    public UserEntity(int id, String firstName, String lastName, String email, String password, String phoneNumber, 
                    boolean emailVerified, LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime lastLogin, 
                    UserRole role) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.emailVerified = emailVerified;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.lastLogin = lastLogin;
        this.role = role;
        this.booking = new HashSet<>();
    }

    // Default constructor
    public UserEntity() {
    }
    
    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }

    public Set<BookingEntity> getBooking() {
        return booking;
    }

    public void setBooking(Set<BookingEntity> booking) {
        this.booking = booking;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}