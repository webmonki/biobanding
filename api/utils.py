from datetime import datetime, date
import re


def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError ("Type %s not serializable" % type(obj))



def emailIsValid(email):
    # regex = re.compile(
    #     r"([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*])")
    regex = re.compile(r"^([\wäöüÜÖÄß])+(([\.]{0,1}[\wäöüÜÖÄß])?)*(([\+]{0,1}[\wäöüÜÖÄß])?)*([\wäöüÜÖÄß-])*\@([\wäöüÜÖÄß-]+\.)+([\w]{2,})+$")
    if re.fullmatch(regex, email):
        return True
    else:
        return False
