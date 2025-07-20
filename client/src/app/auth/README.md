# Authentication Pages

This directory contains the login and signup pages for the FNT application.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Form Validation**: Uses Zod schema validation with react-hook-form
- **Smooth Animations**: Framer Motion animations for enhanced UX
- **Accessibility**: Proper ARIA labels, focus management, and keyboard navigation
- **Loading States**: Visual feedback during form submission
- **Password Visibility Toggle**: Show/hide password functionality
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## Pages

### `/auth/login`
- Email and password authentication
- Form validation with error messages
- Loading spinner during submission
- Link to signup page

### `/auth/signup`
- Full name, email, password, and confirm password fields
- Password confirmation validation
- Form validation with error messages
- Loading spinner during submission
- Link to login page

## Components Used

- `Button` - Interactive buttons with hover and loading states
- `Input` - Form inputs with proper styling and focus states
- `Label` - Accessible form labels
- `Card` - Container components for the forms
- `Spinner` - Loading indicator component

## Styling

- Uses Tailwind CSS for responsive design
- Gradient backgrounds for visual appeal
- Backdrop blur effects for modern glass-morphism look
- Consistent color schemes (blue for login, purple for signup)
- Smooth transitions and hover effects

## Form Validation

- Email format validation
- Password minimum length (6 characters)
- Password confirmation matching
- Name minimum length (2 characters)
- Real-time error display with animations

## Future Enhancements

- Integration with backend API
- Social login options
- Password strength indicator
- Remember me functionality
- Forgot password flow
- Email verification
- Two-factor authentication 