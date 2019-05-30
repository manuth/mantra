FROM php:apache
RUN chown -R www-data:www-data /var/www

RUN apt update -y
RUN apt upgrade -y
RUN apt install --no-install-recommends -y \
    libicu-dev \
    libmagickwand-dev \
    libtidy-dev \
    libzip-dev \
    mysql-client \
    unzip \
    zip

RUN a2enmod rewrite

RUN docker-php-ext-configure intl
RUN docker-php-ext-configure zip --with-libzip
RUN docker-php-ext-install \
    gd \
    intl \
    pdo \
    pdo_mysql \
    tidy \
    zip
RUN pecl install \
    xdebug \
    imagick
RUN docker-php-ext-enable \
    xdebug \
    imagick

COPY .docker/xdebug.ini $PHP_INI_DIR/conf.d/
COPY .docker/datetime.ini $PHP_INI_DIR/conf.d/
COPY --chown=www-data:www-data .docker/.env ../.env