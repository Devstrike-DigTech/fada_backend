export default class Phone {
  public static format_validate(
    phone: string,
    type = 'ng',
    acceptLandline = false,
  ) {
    phone = phone.trim();

    switch (type.toLowerCase()) {
      case 'ng':
        const landline = /^(707|709|804|819)(\d{7})$/;
        const landline2 = /^(7028|7029|7027)(\d{6})$/;

        const mobile =
          /^(701|703|704|705|706|708|801|802|803|805|806|807|808|809|810|811|812|813|814|815|816|817|818|901|902|903|904|905|906|907|908|909|911|912|913|915|916)(\d{7})$/;
        const mobile2 = /^(7020|7021|7022|7025|7026)(\d{6})$/;

        // Clean number
        phone = phone.replace(/[-(). ]/g, '');
        // Remove country code +234
        phone = phone.replace(/^\+/, '');
        phone = phone.replace(/^234/, '');
        // Remove leading zero (0)
        phone = phone.replace(/^0/, '');

        // Test number
        if (/^702/.test(phone)) {
          if (acceptLandline) {
            return landline2.test(phone) || mobile2.test(phone)
              ? '+234' + phone
              : false;
          }
          return mobile2.test(phone) ? '+234' + phone : false;
        }

        if (acceptLandline) {
          return landline.test(phone) || mobile.test(phone)
            ? '+234' + phone
            : false;
        }

        return mobile.test(phone) ? '+234' + phone : false;

      case 'ngland':
        const patternNgLand =
          /^((0)[129]|(3)([01]|[3-9])|(4)[1-8]|(5)[0-9]|(6)[0-9]|(7)([1-3]|[5-9])|(8)[2-9])(\d{7})$/;
        // Clean number
        phone = phone.replace(/[-(). ]/g, '');
        // Remove country code +234
        phone = phone.replace(/^\+/, '');
        phone = phone.replace(/^234/, '');
        // Remove leading zero (0)
        phone = phone.replace(/^0/, '');

        if (/^[129]/.test(phone)) {
          return patternNgLand.test('0' + phone) ? '+234' + phone : false;
        }

        return patternNgLand.test(phone) ? '+234' + phone : false;

      case 'uk':
        const patternUk = /^(7)(\d{9})$/;
        // Clean number
        phone = phone.replace(/[-(). ]/g, '');
        // Remove country code +44
        phone = phone.replace(/^\+/, '');
        phone = phone.replace(/^44/, '');
        // Remove leading zero (0)
        phone = phone.replace(/^0/, '');

        // Test number
        return patternUk.test(phone) ? '+44' + phone : false;

      case 'us':
        const patternUs = /^(\d{10})$/;
        // Clean number
        phone = phone.replace(/[-(). ]/g, '');
        // Remove country code +1
        phone = phone.replace(/^\+1/, '');

        // Test number
        return patternUs.test(phone) ? '+1' + phone : false;

      default:
        return false;
    }
  }
}
