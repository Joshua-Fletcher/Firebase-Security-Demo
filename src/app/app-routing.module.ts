import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'auth/sign-in',
    loadChildren: () => import('./sign-in/sign-in.module').then( m => m.SignInPageModule)
  },
  {
    path: '',
    redirectTo: 'auth/sign-in',
    pathMatch: 'full'
  },
  {
    path: 'user/home',
    loadChildren: () => import('./user-home/user-home.module').then(m => m.UserHomePageModule)
  },
  {
    path: 'admin/user-list',
    loadChildren: () => import('./admin-page/admin-page.module').then(m => m.AdminPageModule)
  },
  {
    path: 'documents',
    loadChildren: () => import('./documents/documents.module').then(m => m.DocumentsPageModule)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { 
      preloadingStrategy: PreloadAllModules,
      initialNavigation: 'enabled',
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
