def zap_started(zap):
    # Example login process
    target_url = "http://your-target-url"
    login_url = f"{target_url}/login"
    
    # Navigate to login page
    zap.urlopen(login_url)
    zap.wait_for_completion()
    
    # Submit login form
    zap.ajax.submit_form(
        action_url=login_url,
        params={
            "username": "your-username",
            "password": "your-password"
        }
    )
    zap.wait_for_completion()