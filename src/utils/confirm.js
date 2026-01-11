import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export const confirmAction = ({
  title = "Confirm",
  message = "Are you sure you want to do this?",
  onConfirm,
  onCancel,
  confirmLabel = "Yes, Delete it!",
  cancelLabel = "Cancel"
}) => {
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div className="custom-ui-confirm p-4 bg-white rounded shadow-lg text-center" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className="mb-3">
             <i className="fal fa-exclamation-triangle fa-3x text-warning"></i>
          </div>
          <h4 className="mb-2">{title}</h4>
          <p className="text-muted mb-4">{message}</p>
          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn btn-secondary"
              onClick={() => {
                onCancel?.();
                onClose();
              }}
            >
              {cancelLabel}
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      );
    }
  });
};
