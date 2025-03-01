FROM quay.io/keycloak/keycloak:26.0.5 as BUILDER

WORKDIR /opt/keycloak

RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:latest
COPY --from=builder /opt/keycloak/ /opt/keycloak/

COPY keycloak/themes/grisera/ /opt/keycloak/themes/grisera
COPY keycloak/realm-config /opt/keycloak/data/import

ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev", "--import-realm"]