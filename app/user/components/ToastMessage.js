"use client";
import Swal from 'sweetalert2';

export const showToast = (message, type) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  switch (type) {
    case "success":
      Toast.fire({
        icon: 'success',
        title: message
      });
      break;
    case "error":
      Toast.fire({
        icon: 'error',
        title: message
      });
      break;
    case "info":
      Toast.fire({
        icon: 'info',
        title: message
      });
      break;
    case "warning":
      Toast.fire({
        icon: 'warning',
        title: message
      });
      break;
    default:
      Toast.fire({
        icon: undefined,
        title: message
      });
  }
};
export default function ToastMessage() {
  return null; 
}