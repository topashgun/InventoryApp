FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD 123  
ENV MYSQL_DATABASE containers  
ENV MYSQL_USER user1  
ENV MYSQL_PASSWORD user1

ADD setup.sql /docker-entrypoint-initdb.d
