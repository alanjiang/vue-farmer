git clone https://github.com/Panda-Hope/vue-qqmusic




docker run --name atlassian-mysql --restart always -p 3306:3306 -v /opt/mysql_data:/var/lib/mysql -v /etc/my.cnf:/var/lib/mysql/my.cnf  -e MYSQL_ROOT_PASSWORD=666888 -d mysql:5.7



docker run --detach --restart always -v /data/atlassian/confluence:/home --publish 8080:8080 docker.io/cptactionhank/atlassian-jira-software:latest


CREATE USER 'jira'@'localhost' IDENTIFIED BY 'jira';

CREATE USER 'jira'@'39.108.210.27' IDENTIFIED BY 'jira';

GRANT ALL ON *.* TO 'jira'@'localhost' WITH GRANT OPTION;
GRANT ALL ON *.* TO 'jira'@'39.108.210.27' WITH GRANT OPTION;



CREATE USER ‘jira’@’39.108.210.27’ IDENTIFIED BY ‘jira’;

GRANT ALL ON *.* TO ‘jira’@’39.108.210.27' WITH GRANT OPTION;


docker  cp  /etc/my.cnf  8cdfa51dbf71:/var/lib/mysql

