import { CanNavigateToAdminGuard } from './can-navigate-to-admin.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('CanNavigateToAdminGuard', () => {
  let guard: CanNavigateToAdminGuard;

  beforeEach(() => {
    guard = new CanNavigateToAdminGuard();
  });

  it('should return true if window.confirm is true', () => {
    expect(guard).toBeTruthy();
    let windowSpy = spyOn(window, 'confirm').and.returnValue(true);

    expect(
      guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    ).toBeTrue();
    expect(window.confirm).toHaveBeenCalledTimes(1);
  });
  it('should return true if previous answer was  true', () => {
    let windowSpy = spyOn(window, 'confirm').and.returnValue(true);
    guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(
      guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    ).toBeTrue();
    expect(window.confirm).toHaveBeenCalledTimes(1); //confirm window should not show up 2nd time
  });
  it('should return false if previous answer was  false', () => {
    let windowSpy = spyOn(window, 'confirm').and.returnValue(false);
    expect(
      guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    ).toBeFalse();
    expect(window.confirm).toHaveBeenCalledTimes(1); //confirm window should not show up 2nd time
  });
});
