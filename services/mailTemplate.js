function getResisterUserTemplate(url) {
    return `
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            h2 {
                color: #333333;
            }
            p {
                color: #555555;
            }
            .logo {
                max-width: 150px;
                margin-bottom: 20px;
                text-align: center;
            }
            .activate-link {
                color: blue;
                text-decoration: underline;
                cursor: pointer;    
            }
        </style>
        <div class="container">
            <div> <img src="https://www.eitbiz.com/assets/images/logo.webp" alt="Company Logo" class="logo"> </div>
            <h2>Thank you for registering with our service!</h2>
            <p>Your registration is almost complete. Please click the following link to activate your account:</p>
            <p><a href="${url}" class="activate-link">Click here to activate your account</a></p>
        </div>
    `;
}

function getForgotPasswordTemplate(url) {
    return `
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            h2 {
                color: #333333;
            }
            p {
                color: #555555;
            }
            .logo {
                max-width: 150px;
                margin-bottom: 20px;
                text-align: center;
            }
            .reset-link {
                color: blue;
                text-decoration: underline;
                cursor: pointer;
            }
        </style>
        <div class="container">
        <img src="https://www.eitbiz.com/assets/images/logo.webp" alt="Company Logo" class="logo">
            <h2>Forgot password request</h2>
            <p>You are receiving this email because you have requested to reset the password for your account.</p>
            <p>Please click on the following link to reset your password:</p>
            <p><a href="${url}" class="reset-link">Reset Password</a></p>
            <p>Note: This link is valid for 10 minutes only. If you do not reset your password within this time, you will need to request a new reset link.</p>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        </div>
    `;
}

const getResetPasswordTemplate = () => {
    return `
        <html>
            <head>
                <style>
                    /* Define your email styling here */
                    body {
                        font-family: Arial, sans-serif;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .logo {
                        max-width: 150px;
                        margin-bottom: 20px;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://www.eitbiz.com/assets/images/logo.webp" alt="Company Logo" class="logo">
                        <h2>Password Reset Successful</h2>
                    </div>
                    <p>Your password has been successfully reset.</p>
                    <p>If you did not initiate this action, please contact us immediately.</p>
                    <p>Thank you.</p>
                </div>
            </body>
        </html>
    `;
};


export { getResisterUserTemplate, getForgotPasswordTemplate,getResetPasswordTemplate };
