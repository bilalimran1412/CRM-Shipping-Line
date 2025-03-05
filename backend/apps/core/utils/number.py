import re
def thousand_separator(amount):
    new = re.sub(r"^(-?\d+)(\d{3})", r'\g<1> \g<2>', str(amount))

    orig = str(amount)

    if orig == new:
        return new
    else:
        return thousand_separator(new)
