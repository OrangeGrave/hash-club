package repository

import (
	"context"
	"hash-club/models"

	"gorm.io/gorm"
)

type UserRepository struct {
	DB *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (r *UserRepository) Create(ctx context.Context, u *models.User) error {
	return r.DB.WithContext(ctx).Create(u).Error
}

func (r *UserRepository) FindByID(ctx context.Context, id uint) (*models.User, error) {
	var u models.User
	err := r.DB.WithContext(ctx).First(&u, id).Error
	return &u, err
}

func (r *UserRepository) FindByUsername(ctx context.Context, username string) (*models.User, error) {
	var u models.User
	err := r.DB.WithContext(ctx).
		Where("username = ?", username).
		First(&u).
		Error
	return &u, err
}

func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*models.User, error) {
	var u models.User
	err := r.DB.WithContext(ctx).
		Where("email = ?", email).
		First(&u).
		Error
	return &u, err
}

func (r *UserRepository) FindByIdentity(ctx context.Context, identity string) (*models.User, error) {
	var u models.User
	err := r.DB.WithContext(ctx).
		Where("email = ? OR phone = ?", identity, identity).
		First(&u).
		Error
	return &u, err
}

func (r *UserRepository) Update(ctx context.Context, u *models.User) error {
	return r.DB.WithContext(ctx).Save(u).Error
}

func (r *UserRepository) Delete(ctx context.Context, id uint) error {
	return r.DB.WithContext(ctx).Delete(&models.User{}, id).Error
}

func (r *UserRepository) GetAllUsers(ctx context.Context) ([]models.User, error) {
	var users []models.User
	err := r.DB.WithContext(ctx).Find(&users).Error
	return users, err
}
