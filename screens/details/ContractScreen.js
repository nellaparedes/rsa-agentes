import rsaApi from "../../api/rsa.js";
import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
//Components
import Colors from "../../constants/Colors";
import TextCatam from "../../components/TextCatamaran";
import ContentPolicy from "../partials/ContentPolicy";
import ContentClaims from "../partials/ContentClaims";
import ContentSac from "../partials/ContentSac";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
export default class ContractScreen extends React.Component {
  constructor(props) {
    super(props);
    this.rsaApi = new rsaApi();

    this.state = {
      loading: false,
      client: this.props.route.params?.client,
      name: this.props.route.params?.name,
      tab: "policies",
      data: [],
    };
  }

  getContracts = async (tab) => {
    this.setState({ loading: true, tab: tab });

    try {
      const token = await AsyncStorage.getItem("_token");

      this.rsaApi.getContracts(token, this.state.client, tab).then((res) => {
        if (!res.code) {
          this.setState({
            data: res,
            loading: false,
          });
        } else {
          if (res.code === 401 || res.code === 400) {
            this.props.navigation.navigate("Login");
          } else {
            var msg = "";
            this.setState({ loading: false });
            Object.values(res.validations).map(function (itemData, index) {
              if (index === 0) {
                msg = itemData;
              } else {
                msg = msg + " \n" + itemData;
              }
            });
            if (res.validations) {
              Alert.alert("Error", msg, [{ text: "Cerrar" }]);
            }
          }
        }
      });
    } catch (err) {
      Alert.alert("Error", err.message, [{ text: "Cerrar" }]);
    }
  };

  getTabMenuStyle(tab) {
    if (this.state.tab === tab) {
      return {
        container: styles.tabSelect,
        text: styles.tabTextSelect,
      };
    }
    return {
      container: styles.tabOption,
      text: styles.tabTextOption,
    };
  }

  renderTabMenu() {
    const array = {
      policies: "Cartera",
      expired: "Vencida",
      byexpired: "Por vencer",
      claims: "Reclamos",
      sac: "SAC",
    };

    const menu = [];
    let menuStyle;

    for (const tab of Object.keys(array)) {
      menuStyle = this.getTabMenuStyle(tab);
      menu.push(
        <TouchableOpacity
          onPress={() => this.getContracts(tab)}
          style={menuStyle.container}
          key={tab}
        >
          <TextCatam font="bold" others={menuStyle.text}>
            {array[tab]}
          </TextCatam>
        </TouchableOpacity>
      );
    }

    return menu;
  }

  componentDidMount = () => {
    this.getContracts("policies");
  };

  renderItem = (item) => {
    switch (this.state.tab) {
      case "claims":
        return (
          <ContentClaims
            letter={item.letter}
            client={item.cliente}
            claim={item.reclamo}
            insurer={item.aseguradora}
            poliza={item.poliza}
            branch={item.ramo}
            plan={item.producto}
            date_register={item.fecRegistro}
            value_present={item.valPresentado}
            date_pay={item.fecPago}
            patient={item.paciente}
            value_pay={item.valPagado}
          />
        );
      case "sac":
        return (
          <ContentSac
            letter={item.letter}
            poliza={item.poliza}
            client={item.cliente}
            case={item.caso}
            insurer={item.aseguradora}
            plan={item.producto}
            date_register={item.fecRegistro}
            type={item.tipo}
            contact={item.contacto}
            date_atention={item.fecAtencion}
            patient={item.paciente}
          />
        );

      default:
        return (
          <ContentPolicy
            policy={item.poliza}
            insurer={item.aseguradora}
            client={item.cliente}
            status={item.estado}
            branch={item.ramo}
            plan={item.producto}
            dependents={item.cantDep}
            validity={item.vigDesde}
            renew={item.vigHasta}
            frequency={item.formaPago}
            deal={item.negocio}
            deductible={item.deducible}
            primenet={item.primaNeta}
            ejecutive={item.ejecutivo}
          />
        );
    }
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <View style={styles.contentBar}></View>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={Colors.greenLight} />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.contentBar} />

        <TouchableOpacity
          onPress={() => this.props.navigation.goBack()}
          style={styles.contentTitle}
        >
          <View style={styles.btnBack}>
            <FontAwesomeIcon icon={faArrowLeft} style={styles.iconBack} />
          </View>
          <View style={styles.title}>
            <TextCatam font="bold" others={styles.textTitle}>
              {this.state.name}
            </TextCatam>
          </View>
        </TouchableOpacity>

        <View style={styles.contentNav}>{this.renderTabMenu()}</View>

        <View style={styles.contentBody}>
          <FlatList
            data={this.state.data}
            extraData={this.state}
            renderItem={({ item }) => this.renderItem(item)}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
              <View style={{ margin: 10, alignItems: "center" }}>
                <TextCatam>No hay registros</TextCatam>
              </View>
            }
          />
        </View>
      </View>
    );
  }
}

ContractScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  contentBar: {
    height: Platform.OS === "ios" ? 55 : StatusBar.currentHeight,
    backgroundColor: Colors.greenDark,
  },
  contentTitle: {
    height: 40,
    margin: 10,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  btnBack: {
    width: "10%",
  },
  iconBack: {
    fontSize: 25,
    color: Colors.greenDark,
  },
  title: {
    width: "90%",
  },
  textTitle: {
    fontSize: 14,
    color: Colors.greenDark,
  },
  contentNav: {
    height: 30,
    marginBottom: 5,
    flexDirection: "row",
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: Colors.greyDark,
  },
  tabSelect: {
    width: "20%",
    backgroundColor: Colors.greyDark,
    justifyContent: "center",
    alignItems: "center",
  },
  tabOption: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 3,
    paddingBottom: 3,
  },
  tabTextSelect: {
    fontSize: 12,
    color: Colors.greenDark,
  },
  tabTextOption: {
    fontSize: 12,
  },
  contentBody: {
    flex: 1,
  },
});
