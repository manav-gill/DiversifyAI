import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function RazorpayCheckout({ options, onSuccess, onCancel }) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            height: 100vh; 
            background-color: rgba(0, 0, 0, 0.4); 
            display: flex; 
            justify-content: center; 
            align-items: center; 
          }
        </style>
      </head>
      <body>
        <script>
          function postMessageToRN(data) {
            window.ReactNativeWebView.postMessage(JSON.stringify(data));
          }

          document.addEventListener('DOMContentLoaded', () => {
            const options = ${JSON.stringify(options)};
            
            options.handler = function(response) {
              postMessageToRN({ type: 'SUCCESS', response });
            };
            
            options.modal = options.modal || {};
            options.modal.ondismiss = function() {
              postMessageToRN({ type: 'DISMISS' });
            };

            const rzp = new window.Razorpay(options);
            
            rzp.on('payment.failed', function(response) {
              postMessageToRN({ type: 'ERROR', response });
            });

            rzp.open();
          });
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: htmlContent }}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'SUCCESS') {
              onSuccess(data.response);
            } else if (data.type === 'DISMISS') {
              onCancel();
            } else if (data.type === 'ERROR') {
              onCancel(data.response);
            }
          } catch (e) {
            console.error('Failed to parse webview message:', e);
            onCancel();
          }
        }}
        containerStyle={styles.webviewContainer}
        style={styles.webview}
        bounces={false}
        originWhitelist={['*']}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
