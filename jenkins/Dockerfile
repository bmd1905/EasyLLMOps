# Ref: https://hackmamba.io/blog/2022/04/running-docker-in-a-jenkins-container/
FROM jenkins/jenkins:lts
USER root
RUN curl https://get.docker.com > dockerinstall && chmod 777 dockerinstall && ./dockerinstall
USER jenkins