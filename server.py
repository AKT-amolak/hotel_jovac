import http.server
import urllib.request
import urllib.error
import sys

PORT = 8000

class ProxyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def handle_proxy(self, method):
        # We proxy requests starting with /api/
        if self.path.startswith('/api/'):
            # Reconstruct the target URL
            target_path = self.path[4:] # strip '/api' -> e.g. '/hotels/' or '/hotels/5/'
            target_url = f"https://demohotelsapi.pythonanywhere.com{target_path}"
            
            # Read request body if present
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length) if content_length > 0 else None
            
            # Prepare request headers
            headers = {}
            for key, val in self.headers.items():
                if key.lower() not in ('host', 'content-length', 'connection'):
                    headers[key] = val
            
            # Perform proxy fetch
            req = urllib.request.Request(
                url=target_url,
                data=body,
                headers=headers,
                method=method
            )
            
            try:
                with urllib.request.urlopen(req) as response:
                    self.send_response(response.status)
                    # Forward response headers
                    for key, val in response.info().items():
                        if key.lower() not in ('transfer-encoding', 'connection', 'content-length'):
                            self.send_header(key, val)
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(response.read())
            except urllib.error.HTTPError as e:
                self.send_response(e.code)
                for key, val in e.headers.items():
                    if key.lower() not in ('transfer-encoding', 'connection', 'content-length'):
                        self.send_header(key, val)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(e.read())
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
        else:
            # Fall back to static file serving
            super().handle_proxy(method) if hasattr(super(), 'handle_proxy') else None

    # Override standard methods
    def do_GET(self):
        if self.path.startswith('/api/'):
            self.handle_proxy('GET')
        else:
            super().do_GET()

    def do_POST(self):
        if self.path.startswith('/api/'):
            self.handle_proxy('POST')
        else:
            self.send_error(405, "Method not allowed")

    def do_PUT(self):
        if self.path.startswith('/api/'):
            self.handle_proxy('PUT')
        else:
            self.send_error(405, "Method not allowed")

    def do_DELETE(self):
        if self.path.startswith('/api/'):
            self.handle_proxy('DELETE')
        else:
            self.send_error(405, "Method not allowed")

    def do_OPTIONS(self):
        # Handle CORS preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

if __name__ == '__main__':
    handler = ProxyHTTPRequestHandler
    httpd = http.server.HTTPServer(("", PORT), handler)
    print(f"LuxeStay Proxy Server running on port {PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        sys.exit(0)
