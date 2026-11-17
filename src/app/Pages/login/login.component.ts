
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/Service/login.service';
import { LoginReq } from 'src/app/Model/LoginReq';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loading = false;
  showPassword = false;
  username = '';
  password = '';

  constructor(
    private auth: LoginService,
    private router: Router
  ) {}

  login(): void {
    if (this.loading) {
      return;
    }

    const username = this.username.trim();
    if (username === '' || this.password === '') {
      Swal.fire('Required', 'Please enter username and password', 'warning');
      return;
    }

    const request: LoginReq = {
      username,
      password: this.password
    };

    this.loading = true;

    this.auth.login(request).subscribe({

      next: (response) => {

        this.auth.saveToken(response.token);

        this.loading = false;

        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'Welcome to NCM!',
          timer: 1200,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/dashboard']);
        });

      },

      error: (error:any) => {

        this.loading = false;

        Swal.fire(
          'Login Failed',
          error.status === 401
            ? 'Invalid username or password'
            : 'Unable to connect to server',
          'error'
        );

      }

    });
  }
  
}
