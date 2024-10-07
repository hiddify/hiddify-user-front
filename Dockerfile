# مرحله 1: ساختن تصویر از محیط ساخت
FROM node:18-alpine AS build

# تنظیم دایرکتوری کاری
WORKDIR /app

# کپی فایل‌های package.json و package-lock.json به داخل کانتینر
COPY package*.json ./

# نصب وابستگی‌های پروژه
RUN npm install

# کپی فایل‌های پروژه به دایرکتوری کاری
COPY . .

# اجرای دستور ساخت پروژه
RUN npm run build

# مرحله 2: ساختن تصویر برای محیط اجرا (استفاده از سرور nginx)
FROM nginx:stable-alpine

# کپی فایل‌های ساخته شده به دایرکتوری پیش‌فرض nginx
COPY --from=build /app/dist /usr/share/nginx/html

# کپی فایل تنظیمات nginx (در صورت نیاز)
# COPY nginx.conf /etc/nginx/nginx.conf

# باز کردن پورت 80
EXPOSE 80

# اجرای nginx
CMD ["nginx", "-g", "daemon off;"]